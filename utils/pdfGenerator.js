// utils/pdfGenerator.js
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
    textDecoration: 'underline',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  tableCol: {
    width: '20%', // Adjust as needed
    paddingRight: 5,
  },
  tableCell: {
    fontSize: 10,
  },
});

export const generatePDF = (data) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Course Specification</Text>

      {/* Course Specification */}
      <View style={styles.section}>
        <Text style={styles.text}>Course Code: {data.courseCode || 'N/A'}</Text>
        <Text style={styles.text}>Course Name: {data.courseName || 'N/A'}</Text>
        <Text style={styles.text}>Course Type: {data.courseType || 'N/A'}</Text>
        <Text style={styles.text}>Department: {data.department || 'N/A'}</Text>
        <Text style={styles.text}>Total Credit Hours: {data.hoursTotal || 'N/A'}</Text>
        <Text style={styles.subHeader}>Credit Structure:</Text>
        {data.creditStructure ? (
          <>
            <Text style={styles.listItem}>Lecture: {data.creditStructure.lecture || 'N/A'}</Text>
            <Text style={styles.listItem}>Tutorial: {data.creditStructure.tutorial || 'N/A'}</Text>
            <Text style={styles.listItem}>Lab: {data.creditStructure.lab || 'N/A'}</Text>
          </>
        ) : (
          <Text style={styles.listItem}>Credit Structure data is unavailable.</Text>
        )}
        <Text style={styles.text}>
          Pre-requisites: {data.preRequisites && data.preRequisites.length > 0 ? data.preRequisites.join(', ') : 'None'}
        </Text>
      </View>

      {/* Course Description */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Course Description</Text>
        <Text style={styles.text}>Course Contents: {data.courseDescription?.courseContents || 'N/A'}</Text>
        <Text style={styles.text}>Target Audience: {data.courseDescription?.targetAudience || 'N/A'}</Text>
        <Text style={styles.text}>Industry Relevance: {data.courseDescription?.industryRelevance || 'N/A'}</Text>
      </View>

      {/* Course Learning Outcomes */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Course Learning Outcomes (CLOs)</Text>
        {data.clOs && data.clOs.length > 0 ? (
          data.clOs.map((clo, index) => (
            <Text key={index} style={styles.text}>
              CLO {index + 1}: {clo.description || 'N/A'}
            </Text>
          ))
        ) : (
          <Text style={styles.text}>No CLOs available.</Text>
        )}
      </View>

      {/* Mapping CLO to PLOs */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Mapping Course Learning Outcomes to Program Learning Outcomes (PLOs)</Text>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableCol}>CLO</Text>
          <Text style={styles.tableCol}>PLOs</Text>
        </View>
        {/* Table Rows */}
        {data.clOsToPloMappings && data.clOsToPloMappings.length > 0 ? (
          data.clOsToPloMappings.map((mapping, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{mapping.clo || 'N/A'}</Text>
              <Text style={styles.tableCol}>{mapping.plo && mapping.plo.length > 0 ? mapping.plo.join(', ') : 'N/A'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No CLO to PLO mappings available.</Text>
        )}
      </View>

      {/* Teaching and Learning Methodology */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Teaching and Learning Methodology</Text>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableCol}>CLO</Text>
          <Text style={styles.tableCol}>Methodology</Text>
        </View>
        {/* Table Rows */}
        {data.teachingAndLearningMethods && data.teachingAndLearningMethods.length > 0 ? (
          data.teachingAndLearningMethods.map((method, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{method.clo || 'N/A'}</Text>
              <Text style={styles.tableCol}>{method.methodology || 'N/A'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No Teaching and Learning Methods available.</Text>
        )}
      </View>

      {/* Course Delivery Methodology */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Course Delivery Methodology</Text>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableCol}>Method</Text>
          <Text style={styles.tableCol}>% of Delivery</Text>
        </View>
        {/* Table Rows */}
        {data.courseDeliveryMethodologies && data.courseDeliveryMethodologies.length > 0 ? (
          data.courseDeliveryMethodologies.map((method, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{method.method || 'N/A'}</Text>
              <Text style={styles.tableCol}>{method.percentage || 'N/A'}%</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No Course Delivery Methodologies available.</Text>
        )}
      </View>

      {/* Course Resources */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Course Resources</Text>
        {data.courseResources && data.courseResources.length > 0 ? (
          data.courseResources.map((resource, index) => (
            <Text key={index} style={styles.listItem}>
              • {resource || 'N/A'}
            </Text>
          ))
        ) : (
          <Text style={styles.text}>No Course Resources available.</Text>
        )}
      </View>

      {/* Assessment Strategy */}
      {data.assessmentStrategy && data.assessmentStrategy.description && (
        <View style={styles.section}>
          <Text style={styles.subHeader}>Assessment Strategy</Text>
          <Text style={styles.text}>{data.assessmentStrategy.description || 'N/A'}</Text>
        </View>
      )}

      {/* Assessments */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Assessments</Text>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableCol}>CLO</Text>
          <Text style={styles.tableCol}>Assessment Type</Text>
          <Text style={styles.tableCol}>Method</Text>
          <Text style={styles.tableCol}>Description</Text>
          <Text style={styles.tableCol}>Weight (%)</Text>
        </View>
        {/* Table Rows */}
        {data.assessments && data.assessments.length > 0 ? (
          data.assessments.map((assessment, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{assessment.clo || 'N/A'}</Text>
              <Text style={styles.tableCol}>{assessment.assessmentType || 'N/A'}</Text>
              <Text style={styles.tableCol}>{assessment.assessmentMethod || 'N/A'}</Text>
              <Text style={styles.tableCol}>{assessment.assessmentDescription || 'N/A'}</Text>
              <Text style={styles.tableCol}>{assessment.weight || 'N/A'}%</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No Assessments available.</Text>
        )}
      </View>
    </Page>
  </Document>
);