import StudentsPicker from '../components/StudentsPicker';
import StudentsTable from '../components/StudentsTable';
import { fetchStudentData, fetchSchoolData, fetchLegalguardianData } from '../utils';
import { useState } from 'react';


const studentsDataComponent = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);
  const [legalguardiansData, setLegalguardiansData] = useState([]);


  const onStudentsPick = async (studentIds) => {
    for (const studentId of studentIds) {
      const studentData = await fetchStudentData(studentId);
      setStudentsData(() => [...studentsData, {...studentData, processed: false}]);
    }
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