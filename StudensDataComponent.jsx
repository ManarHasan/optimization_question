import StudentsPicker from '../components/StudentsPicker';
import StudentsTable from '../components/StudentsTable';
import { fetchStudentData, fetchSchoolData, fetchLegalguardianData } from '../utils';
import { useState } from 'react';


const studentsDataComponent = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);
  const [legalguardiansData, setLegalguardiansData] = useState([]);


  // promise.all is faster than awaiting seperate api calls.
  const onStudentsPick = async (studentIds) => {
    await Promise.all(studentIds.map(async (studentId) => {
        const studentData = await fetchStudentData(studentId);
        // when updating with a function it should be instantaneous and not be updated on the next iteration
        // add the processed field to not re-fetch the other students data in the next map
        setStudentsData(() => [...studentsData, {...studentData, processed: false}]);
    }))

    // make sure to set processed to true for the next time this function is called
    const processedStudentData = studentsData.map(async (student) => {
        const { schoolId, legalguardianId } = student;
        const [schoolData, legalguardianData] = await Promise.all([
            await fetchSchoolData(schoolId),
            await fetchLegalguardianData(legalguardianId)
        ])
        setSchoolsData([...schoolsData, schoolData]);
        setLegalguardiansData([...legalguardiansData, legalguardianData]);
        return {
            ...student,
            processed: true
        }
    })
    setStudentsData(processedStudentData);
  };


  return (
    <>
      <StudentsPicker onPickHandler={onStudentsPick} />
      <StudentsTable
        studentsData={studentsData}
        schoolsData={schoolsData}
        LegalguardiansData={legalguardiansData}
      />
      </>
      )
      }