// pages/api/courses/index.js
import dbConnect from '../../../lib/mongodb';
import { authenticate } from '../../../lib/auth';
import Course from '../../../models/Course';
import CLO from '../../../models/CLO';
import PLO from '../../../models/PLO';
import CCDP from '../../../models/CCDP';
import Assessment from '../../../models/Assessment';
import CLOtoPLO from '../../../models/CLOtoPLO';
import TeachingMethodology from '../../../models/TeachingMethodology';
import AssessmentStrategy from '../../../models/AssessmentStrategy';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      // Authenticate the request
      await authenticate(req, res, async () => {
        const data = req.body;

        // Debugging: Log the received data
        console.log('Received Course Data:', data);

        // Validate required fields
        if (!data.ccdp || !Array.isArray(data.ccdp) || data.ccdp.length === 0) {
          return res.status(400).json({ message: 'At least one CCDP entry is required' });
        }

        if (!data.assessments || !Array.isArray(data.assessments) || data.assessments.length === 0) {
          return res.status(400).json({ message: 'At least one assessment is required' });
        }

        if (!data.clOs || !Array.isArray(data.clOs) || data.clOs.length === 0) {
          return res.status(400).json({ message: 'At least one CLO is required' });
        }

        // Handle Course Resources
        // Since courseResources is already an array, no need to split
        const courseResources = Array.isArray(data.courseResources)
          ? data.courseResources.map(item => item.trim()).filter(item => item)
          : [];

        // Create Assessment Strategy if provided
        let assessmentStrategy = null;
        if (data.assessmentStrategy && data.assessmentStrategy.description) {
          assessmentStrategy = await AssessmentStrategy.create({
            description: data.assessmentStrategy.description,
          });
        }

        // Create Teaching and Learning Methods
        const teachingMethods = await Promise.all(
          data.teachingAndLearningMethods.map(async (method) => {
            return await TeachingMethodology.create({
              clo: method.clo,
              methodology: method.methodology,
            });
          })
        );

        // Create CCDP Entries
        const ccdpEntries = await Promise.all(
          data.ccdp.map(async (ccdpData) => {
            return await CCDP.create({
              clo: ccdpData.clo,
              lessonNo: parseInt(ccdpData.lessonNo, 10),
              topics: ccdpData.topics,
              hours: parseFloat(ccdpData.hours),
            });
          })
        );

        // Create Assessments
        const assessments = await Promise.all(
          data.assessments.map(async (assessmentData) => {
            return await Assessment.create({
              clo: assessmentData.clo,
              assessmentType: assessmentData.assessmentType,
              assessmentMethod: assessmentData.assessmentMethod,
              assessmentDescription: assessmentData.assessmentDescription,
              weight: parseFloat(assessmentData.weight),
            });
          })
        );

        // Consolidate Course Delivery Methodologies
        let courseDeliveryMethodologies = [];
        if (Array.isArray(data.courseDeliveryMethodologies)) {
          courseDeliveryMethodologies = data.courseDeliveryMethodologies.map(item => ({
            method: item.method.trim(),
            percentage: parseFloat(item.percentage),
          })).filter(item => item.method && !isNaN(item.percentage));
        }

        // Create the Course first to obtain its _id
        const course = await Course.create({
          courseCode: data.courseCode,
          courseName: data.courseName,
          courseType: data.courseType,
          department: data.department,
          hoursTotal: parseFloat(data.hoursTotal),
          creditStructure: {
            lecture: parseFloat(data.creditStructure.lecture),
            tutorial: parseFloat(data.creditStructure.tutorial),
            lab: parseFloat(data.creditStructure.lab),
          },
          preRequisites: Array.isArray(data.preRequisites)
            ? data.preRequisites.filter(prereq => prereq.trim() !== '')
            : [],
          courseDescription: {
            courseContents: data.courseDescription.courseContents,
            targetAudience: data.courseDescription.targetAudience,
            industryRelevance: data.courseDescription.industryRelevance,
          },
          courseResources: courseResources,
          teachingAndLearningMethods: teachingMethods.map((method) => method._id),
          assessmentStrategy: assessmentStrategy ? assessmentStrategy._id : null,
          ccdp: ccdpEntries.map((entry) => entry._id),
          assessments: assessments.map((assessment) => assessment._id),
          clOs: [], // To be updated after creating CLOs
          clOsToPloMappings: [], // To be updated after creating CLOtoPLO mappings
          courseDeliveryMethodologies: courseDeliveryMethodologies, // Embedded Subdocuments
          // Handle other nested fields like PLOs if necessary
        });

        // Log the created course
        console.log('Created Course:', course);

        // Create CLOs with 'course' field set to course._id
        const clOs = await Promise.all(
          data.clOs.map(async (cloData) => {
            const clo = await CLO.create({
              description: cloData.description,
              course: course._id, // Associate CLO with the Course
              // Add other CLO fields if necessary
            });
            return clo;
          })
        );

        // Log the created CLOs
        console.log('Created CLOs:', clOs);

        // Create CLO to PLO Mappings
        const clOsToPloMappings = await Promise.all(
          data.clOs.map(async (cloData, index) => {
            if (cloData.plo && Array.isArray(cloData.plo)) {
              const mapping = await CLOtoPLO.create({
                clo: clOs[index]._id, // Use the actual CLO ObjectId
                plo: cloData.plo,
              });
              return mapping;
            }
            return null;
          })
        ).then((mappings) => mappings.filter((mapping) => mapping !== null));

        // Log the created CLOtoPLO Mappings
        console.log('Created CLOtoPLO Mappings:', clOsToPloMappings);

        // Update the Course with CLOs and CLOtoPlo Mappings
        course.clOs = clOs.map((clo) => clo._id);
        course.clOsToPloMappings = clOsToPloMappings.map((mapping) => mapping._id);

        // Save the updated Course
        await course.save();

        // Respond with the created course
        res.status(201).json({ message: 'Course created successfully', data: course });
      });
    } catch (error) {
      console.error('Course Submission Error:', error);
      // Check if headers are already sent to prevent "Cannot set headers after they are sent to the client" errors
      if (!res.headersSent) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}