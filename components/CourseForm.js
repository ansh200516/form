// components/CourseForm.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { generatePDF } from '../utils/pdfGenerator';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import Select from './ui/Select';
import Card from './ui/Card';
import Modal from './ui/Modal';
import Tooltip from './ui/Tooltip'; // Optional

const CourseForm = () => {
  // Define fixed methods
  const fixedMethods = [
    { name: 'Lecture' },
    { name: 'Computer Simulations/Labs' },
    { name: 'Project-Based Learning' },
    { name: 'Practical/Labs' },
  ];

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      preRequisites: [''],
      clOs: [{ clo: 'CLO1', description: '', plo: '' }],
      assessments: [
        {
          clo: 'CLO1',
          assessmentType: '',
          assessmentMethod: '',
          assessmentDescription: '',
          weight: '',
        },
      ],
      ccdp: [
        {
          clo: 'CLO1',
          lessonNo: '',
          topics: '',
          hours: '',
        },
      ],
      teachingAndLearningMethods: [
        {
          clo: 'CLO1',
          methodology: '',
        },
      ],
      // Initialize courseDeliveryMethodologies with fixed methods
      courseDeliveryMethodologies: fixedMethods.map(method => ({
        method: method.name,
        percentage: '',
      })),
      others: [], // For dynamic "Others" methods
      assessmentStrategy: {
        description: '',
      },
      courseResources: '', // Ensure it's a string
    },
  });

  // Field Arrays for "Others" methods
  const { fields: othersFields, append: appendOther, remove: removeOther } = useFieldArray({
    control,
    name: 'others',
  });

  // Other Field Arrays
  const { fields: preReqFields, append: appendPreReq, remove: removePreReq } = useFieldArray({
    control,
    name: 'preRequisites',
  });

  const { fields: cloFields, append: appendClo, remove: removeClo } = useFieldArray({
    control,
    name: 'clOs',
  });

  const { fields: assessmentFields, append: appendAssessment, remove: removeAssessment } = useFieldArray({
    control,
    name: 'assessments',
  });

  const { fields: ccdpFields, append: appendCcdp, remove: removeCcdp } = useFieldArray({
    control,
    name: 'ccdp',
  });

  const { fields: teachingMethodFields, append: appendTeachingMethod, remove: removeTeachingMethod } = useFieldArray({
    control,
    name: 'teachingAndLearningMethods',
  });

  const [pdfData, setPdfData] = useState(null); // State to hold data for PDF
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000); // Clears after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [success]);

  const onSubmit = async (data) => {
    console.log('Form Submitted:', data);
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in.');
        setLoading(false);
        return;
      }

      // Consolidate fixed and others methodologies
      const fixedMethodologies = data.courseDeliveryMethodologies.map(item => ({
        method: item.method, // Fixed method name
        percentage: parseFloat(item.percentage),
      }));

      const othersMethodologies = data.others.map(item => ({
        method: item.method,
        percentage: parseFloat(item.percentage),
      }));

      const courseDeliveryMethodologies = [
        ...fixedMethodologies,
        ...othersMethodologies,
      ];

      // Transform courseResources into an array if it's a string
      let courseResources = [];
      if (typeof data.courseResources === 'string') {
        courseResources = data.courseResources.split('\n').map(item => item.trim()).filter(item => item);
      } else if (Array.isArray(data.courseResources)) {
        courseResources = data.courseResources.map(item => item.trim()).filter(item => item);
      }

      // Prepare the payload
      const payload = {
        ...data,
        courseDeliveryMethodologies,
        courseResources,
        others: undefined, // Remove 'others' if not needed by backend
      };

      // Submit the form data to the API
      const res = await axios.post('/api/courses', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API Response:', res.data);

      // Set the PDF data from the API response
      setPdfData(res.data.data); // Assuming API returns the saved course data
      console.log('PDF Data set to:', res.data.data); // Debugging Line

      setSuccess('Course submitted successfully!');
      
      // **Reset the form after setting pdfData**
      reset(); // Reset the form fields

    } catch (err) {
      console.error('Submission Error:', err);
      if (err.response && err.response.data) {
        setError(`Error: ${err.response.data.message || err.response.statusText}`);
        // Optionally, display detailed validation errors
        if (err.response.data.errors) {
          // Map and display each validation error if needed
        }
      } else if (err.request) {
        setError('Error: No response from server. Please try again later.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Display success message */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Display error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Display validation errors */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded">
              <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="list-disc list-inside">
                {Object.entries(errors).map(([field, error], index) => (
                  <li key={index}>
                    {typeof error.message === 'string' ? error.message : `${field} is invalid`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Course Specification */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Specification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Code */}
              <div>
                <label className="block mb-1 font-medium">Course Code</label>
                <Input
                  {...register('courseCode', { required: 'Course Code is required' })}
                  placeholder="Course Code"
                  error={errors.courseCode}
                />
              </div>

              {/* Course Name */}
              <div>
                <label className="block mb-1 font-medium">Course Name</label>
                <Input
                  {...register('courseName', { required: 'Course Name is required' })}
                  placeholder="Course Name"
                  error={errors.courseName}
                />
              </div>

              {/* Course Type */}
              <div>
                <label className="block mb-1 font-medium">Course Type</label>
                <Select {...register('courseType', { required: 'Course Type is required' })} error={errors.courseType}>
                  <option value="">Select Course Type</option>
                  <option value="Core">Core</option>
                  <option value="Elective">Elective</option>
                  {/* Add more options as needed */}
                </Select>
              </div>

              {/* Department */}
              <div>
                <label className="block mb-1 font-medium">Department Responsible for Course Delivery</label>
                <Input
                  {...register('department', { required: 'Department is required' })}
                  placeholder="Department (e.g., Computer Science)"
                  error={errors.department}
                />
              </div>

              {/* Total Credit Hours */}
              <div>
                <label className="block mb-1 font-medium">Total Credit Hours</label>
                <Input
                  type="number"
                  {...register('hoursTotal', { required: 'Total Credit Hours are required' })}
                  placeholder="Total Credit Hours (e.g., 3)"
                  error={errors.hoursTotal}
                />
              </div>
            </div>

            {/* Credit Structure */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Credit Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Lecture Hours */}
                <div>
                  <label className="block mb-1 font-medium">Lecture Hours</label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('creditStructure.lecture', {
                      required: 'Lecture hours are required',
                    })}
                    placeholder="Lecture Hours (e.g., 2)"
                    error={errors.creditStructure?.lecture}
                  />
                </div>

                {/* Tutorial Hours */}
                <div>
                  <label className="block mb-1 font-medium">Tutorial Hours</label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('creditStructure.tutorial', {
                      required: 'Tutorial hours are required',
                    })}
                    placeholder="Tutorial Hours (e.g., 0)"
                    error={errors.creditStructure?.tutorial}
                  />
                </div>

                {/* Lab Hours */}
                <div>
                  <label className="block mb-1 font-medium">Lab Hours</label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('creditStructure.lab', { required: 'Lab hours are required' })}
                    placeholder="Lab Hours (e.g., 2)"
                    error={errors.creditStructure?.lab}
                  />
                </div>
              </div>
            </div>

            {/* Pre-requisites */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Pre-requisites</h3>
              {preReqFields.map((field, index) => (
                <div key={field.id} className="flex items-center mb-2">
                  <Input
                    {...register(`preRequisites.${index}`, { required: 'Pre-requisite is required' })}
                    placeholder={`Pre-requisite ${index + 1} (e.g., COL100)`}
                    className="flex-1"
                    error={errors.preRequisites?.[index]}
                  />
                  <Modal
                    trigger={
                      <Button type="button" variant="destructive" className="ml-2">
                        Remove
                      </Button>
                    }
                    title="Confirm Deletion"
                    description="Are you sure you want to remove this pre-requisite?"
                    onConfirm={() => removePreReq(index)}
                    onClose={() => {}}
                  />
                </div>
              ))}
              <Button type="button" onClick={() => appendPreReq('')} variant="secondary" className="mt-2">
                Add Pre-requisite
              </Button>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Description</h2>
            <div className="space-y-4">
              {/* Course Contents */}
              <div>
                <label className="block mb-1 font-medium">Course Contents</label>
                <Textarea
                  {...register('courseDescription.courseContents', {
                    required: 'Course Contents are required',
                  })}
                  placeholder="Key topics (e.g., Introduction to Programming, Data Structures)"
                  error={errors.courseDescription?.courseContents}
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block mb-1 font-medium">Target Audience</label>
                <Textarea
                  {...register('courseDescription.targetAudience', {
                    required: 'Target Audience is required',
                  })}
                  placeholder="Undergraduate students interested in..."
                  error={errors.courseDescription?.targetAudience}
                />
              </div>

              {/* Industry Relevance */}
              <div>
                <label className="block mb-1 font-medium">Industry Relevance</label>
                <Textarea
                  {...register('courseDescription.industryRelevance', {
                    required: 'Industry Relevance is required',
                  })}
                  placeholder="Relevance to current industry standards..."
                  error={errors.courseDescription?.industryRelevance}
                />
              </div>
            </div>
          </div>

          {/* Course Learning Outcomes (CLOs) */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Learning Outcomes (CLOs)</h2>
            {cloFields.map((field, index) => (
              <div key={field.id} className="flex items-center mb-2">
                <Input
                  {...register(`clOs.${index}.description`, { required: 'CLO description is required' })}
                  placeholder={`CLO ${index + 1} Description`}
                  className="flex-1"
                  error={errors.clOs?.[index]?.description}
                />
                <Modal
                  trigger={
                    <Button type="button" variant="destructive" className="ml-2">
                      Remove
                    </Button>
                  }
                  title="Confirm Deletion"
                  description="Are you sure you want to remove this CLO?"
                  onConfirm={() => removeClo(index)}
                  onClose={() => {}}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendClo({ clo: `CLO${cloFields.length + 1}`, description: '', plo: '' })}
              variant="secondary"
              className="mt-2"
            >
              Add CLO
            </Button>
          </div>

          {/* Mapping CLO to PLOs */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Mapping Course Learning Outcomes to Program Learning Outcomes (PLOs)</h2>
            {cloFields.map((cloField, cloIndex) => (
              <Card key={cloField.id} className="mb-4">
                <h3 className="text-lg font-medium mb-2">CLO {cloIndex + 1} Mapping</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CLO Identifier */}
                  <div>
                    <label className="block mb-1 font-medium">CLO</label>
                    <Input
                      {...register(`clOs.${cloIndex}.clo`, { required: 'CLO identifier is required' })}
                      placeholder={`CLO${cloIndex + 1}`}
                      className="bg-gray-100"
                      readOnly
                      defaultValue={`CLO${cloIndex + 1}`}
                      error={errors.clOs?.[cloIndex]?.clo}
                    />
                  </div>

                  {/* PLOs */}
                  <div>
                    <label className="block mb-1 font-medium">Program Learning Outcomes (PLOs)</label>
                    <Textarea
                      {...register(`clOs.${cloIndex}.plo`, { required: 'At least one PLO is required' })}
                      placeholder="Enter PLOs separated by commas (e.g., PLO1, PLO2)"
                      error={errors.clOs?.[cloIndex]?.plo}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Course Content Delivery Plan (CCDP) */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Content with Delivery Plan</h2>
            {ccdpFields.map((field, index) => (
              <Card key={field.id} className="mb-4">
                <h3 className="text-lg font-medium mb-2">Lesson {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CLO */}
                  <div>
                    <label className="block mb-1 font-medium">CLO</label>
                    <Select
                      {...register(`ccdp.${index}.clo`, { required: 'CLO is required' })}
                      error={errors.ccdp?.[index]?.clo}
                    >
                      <option value="">Select CLO</option>
                      {cloFields.map((clo, cloIdx) => (
                        <option key={clo.id} value={`CLO${cloIdx + 1}`}>
                          CLO{cloIdx + 1}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Lesson No */}
                  <div>
                    <label className="block mb-1 font-medium">Lesson No</label>
                    <Input
                      type="number"
                      {...register(`ccdp.${index}.lessonNo`, { required: 'Lesson Number is required' })}
                      placeholder="Lesson No"
                      error={errors.ccdp?.[index]?.lessonNo}
                    />
                  </div>

                  {/* Topics */}
                  <div className="col-span-2">
                    <label className="block mb-1 font-medium">Topics</label>
                    <Input
                      {...register(`ccdp.${index}.topics`, { required: 'Topics are required' })}
                      placeholder="Topics"
                      error={errors.ccdp?.[index]?.topics}
                    />
                  </div>

                  {/* Hours */}
                  <div>
                    <label className="block mb-1 font-medium">Hours</label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`ccdp.${index}.hours`, { required: 'Hours are required' })}
                      placeholder="Hours"
                      error={errors.ccdp?.[index]?.hours}
                    />
                  </div>
                </div>
                <Modal
                  trigger={
                    <Button type="button" variant="destructive" className="mt-4">
                      Remove Lesson
                    </Button>
                  }
                  title="Confirm Deletion"
                  description="Are you sure you want to remove this lesson?"
                  onConfirm={() => removeCcdp(index)}
                  onClose={() => {}}
                />
              </Card>
            ))}
            <Button
              type="button"
              onClick={() => appendCcdp({ clo: `CLO${cloFields.length + 1}`, lessonNo: '', topics: '', hours: '' })}
              variant="secondary"
            >
              Add Lesson
            </Button>
          </div>

          {/* Teaching and Learning Methodology */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Teaching and Learning Methodology</h2>
            {teachingMethodFields.map((field, index) => (
              <div key={field.id} className="flex items-center mb-2">
                {/* CLO Identifier */}
                <div className="mr-2">
                  <label className="block mb-1 font-medium">CLO</label>
                  <Input
                    {...register(`teachingAndLearningMethods.${index}.clo`, { required: 'CLO is required' })}
                    placeholder={`CLO${index + 1}`}
                    className="bg-gray-100"
                    readOnly
                    defaultValue={`CLO${index + 1}`}
                    error={errors.teachingAndLearningMethods?.[index]?.clo}
                  />
                </div>

                {/* Methodology */}
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Methodology</label>
                  <Input
                    {...register(`teachingAndLearningMethods.${index}.methodology`, { required: 'Methodology is required' })}
                    placeholder="Teaching Methodology"
                    error={errors.teachingAndLearningMethods?.[index]?.methodology}
                  />
                </div>

                <Modal
                  trigger={
                    <Button type="button" variant="destructive" className="ml-2">
                      Remove
                    </Button>
                  }
                  title="Confirm Deletion"
                  description="Are you sure you want to remove this teaching methodology?"
                  onConfirm={() => removeTeachingMethod(index)}
                  onClose={() => {}}
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendTeachingMethod({ clo: `CLO${cloFields.length + 1}`, methodology: '' })}
              variant="secondary"
              className="mt-2"
            >
              Add Teaching Methodology
            </Button>
          </div>

          {/* Course Delivery Methodology */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Delivery Methodology</h2>
            
            {/* Fixed Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fixedMethods.map((method, index) => (
                <div key={index} className="flex items-center">
                  <label className="w-1/2">{method.name}</label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register(`courseDeliveryMethodologies.${index}.percentage`, {
                      required: `${method.name} percentage is required`,
                      min: { value: 0, message: 'Percentage cannot be negative' },
                      max: { value: 100, message: 'Percentage cannot exceed 100%' },
                      valueAsNumber: true,
                    })}
                    placeholder="Percentage (%)"
                    error={errors.courseDeliveryMethodologies?.[index]?.percentage}
                  />
                </div>
              ))}
            </div>
            
            {/* Dynamic "Others" Methods */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Others (Specify)</h3>
              {othersFields.map((field, index) => (
                <div key={field.id} className="flex items-center mb-2">
                  <Input
                    {...register(`others.${index}.method`, { required: 'Method is required' })}
                    placeholder="Specify Method"
                    className="flex-1 mr-2"
                    error={errors.others?.[index]?.method}
                  />
                  <Input
                    type="number"
                    step="0.1"
                    {...register(`others.${index}.percentage`, {
                      required: 'Percentage is required',
                      min: { value: 0, message: 'Percentage cannot be negative' },
                      max: { value: 100, message: 'Percentage cannot exceed 100%' },
                      valueAsNumber: true,
                    })}
                    placeholder="Percentage (%)"
                    className="mr-2"
                    error={errors.others?.[index]?.percentage}
                  />
                  <Button type="button" variant="destructive" onClick={() => removeOther(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => appendOther({ method: '', percentage: '' })} variant="secondary">
                Add Other Method
              </Button>
            </div>
          </div>

          {/* Course Resources */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Course Resources</h2>
            <Textarea
              {...register('courseResources')}
              placeholder="List resources (press Enter for new bullet point)"
              className="h-32"
            />
          </div>

          {/* Assessment Strategy */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Assessment Strategy (Optional)</h2>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea
                {...register('assessmentStrategy.description')}
                placeholder="Describe the overall assessment strategy"
                className="h-24"
              />
            </div>
          </div>

          {/* Assessments */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Assessments</h2>
            {assessmentFields.map((field, index) => (
              <Card key={field.id} className="mb-4">
                <h3 className="text-lg font-medium mb-2">Assessment {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CLO */}
                  <div>
                    <label className="block mb-1 font-medium">CLO</label>
                    <Select
                      {...register(`assessments.${index}.clo`, { required: 'CLO is required' })}
                      error={errors.assessments?.[index]?.clo}
                    >
                      <option value="">Select CLO</option>
                      {cloFields.map((clo, cloIndex) => (
                        <option key={clo.id} value={`CLO${cloIndex + 1}`}>
                          CLO{cloIndex + 1}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Assessment Type */}
                  <div>
                    <label className="block mb-1 font-medium">Assessment Type</label>
                    <Input
                      {...register(`assessments.${index}.assessmentType`, { required: 'Assessment Type is required' })}
                      placeholder="Assessment Type (e.g., Midterm Exam)"
                      error={errors.assessments?.[index]?.assessmentType}
                    />
                  </div>

                  {/* Assessment Method */}
                  <div>
                    <label className="block mb-1 font-medium">Assessment Method</label>
                    <Input
                      {...register(`assessments.${index}.assessmentMethod`, { required: 'Assessment Method is required' })}
                      placeholder="Assessment Method (e.g., Written Exam)"
                      error={errors.assessments?.[index]?.assessmentMethod}
                    />
                  </div>

                  {/* Assessment Description */}
                  <div className="col-span-2">
                    <label className="block mb-1 font-medium">Assessment Description</label>
                    <Textarea
                      {...register(`assessments.${index}.assessmentDescription`, { required: 'Assessment Description is required' })}
                      placeholder="Describe the assessment"
                      error={errors.assessments?.[index]?.assessmentDescription}
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block mb-1 font-medium">Weight (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`assessments.${index}.weight`, {
                        required: 'Weight is required',
                        min: { value: 0, message: 'Weight cannot be negative' },
                        max: { value: 100, message: 'Weight cannot exceed 100%' },
                        valueAsNumber: true,
                      })}
                      placeholder="Weight (%)"
                      error={errors.assessments?.[index]?.weight}
                    />
                  </div>
                </div>
                <Modal
                  trigger={
                    <Button type="button" variant="destructive" className="mt-4">
                      Remove Assessment
                    </Button>
                  }
                  title="Confirm Deletion"
                  description="Are you sure you want to remove this assessment?"
                  onConfirm={() => removeAssessment(index)}
                  onClose={() => {}}
                />
              </Card>
            ))}
            <Button
              type="button"
              onClick={() =>
                appendAssessment({
                  clo: `CLO${cloFields.length + 1}`,
                  assessmentType: '',
                  assessmentMethod: '',
                  assessmentDescription: '',
                  weight: '',
                })
              }
              variant="secondary"
            >
              Add Assessment
            </Button>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Tooltip content="Click to submit the form">
              <Button type="submit" variant="default" className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Tooltip>
          </div>

          {/* PDF Download Link */}
          {pdfData && (
            <div className="mt-4 text-center">
              <PDFDownloadLink document={generatePDF(pdfData)} fileName="course_specification.pdf">
                {({ loading }) => (
                  <Button variant="ghost" className="w-full">
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default CourseForm;