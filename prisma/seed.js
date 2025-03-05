import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    // Hash passwords
    const hashedSuperAdminPassword = await bcrypt.hash('superadmin123', 10);
    const hashedCollegePassword = await bcrypt.hash('college123', 10);
    const hashedHODPassword = await bcrypt.hash('hod123', 10);
    const hashedFacultyPassword = await bcrypt.hash('faculty123', 10);
    const hashedStudentPassword = await bcrypt.hash('student123', 10);

    // Super Admin
    const superAdmin = await prisma.superAdmin.create({
        data: {
            email: "superadmin@admin.com",
            password: hashedSuperAdminPassword,
        }
    });

    console.log("✅ Super Admin Created:", superAdmin.email);

    // College
    const college = await prisma.college.create({
        data: {
            name: "Pugazh Ed University",
            email: "admin@college.com",
            affiliated_university:  "Anna Univ",
            deemed_university :   "No"    ,
            recognition_status : "NAAC",
            institute_code : "STS",
            council_issuing_code : "INST",
            password: hashedCollegePassword,
            superAdminId: superAdmin.id,
        }
    });

    console.log("✅ College Created:", college.name);

    // Department
    const department = await prisma.department.create({
        data: {
            name: "test_dept",
            collegeId: college.id,
            email: "dept@dept.com"
        }
    });

    console.log("✅ Department Created:", department.name);

    // HOD
    const hod = await prisma.hOD.create({
        data: {
            name: "test hod",
            email: "hod@hod.com",
            password: hashedHODPassword,
            collegeId: college.id,
            departmentId: department.id,
        }
    });

    console.log("✅ HOD Created:", hod.name);

    // Faculty
    const faculty = await prisma.faculty.create({
        data: {
            name: "Master JD",
            email: "faculty@faculty.com",
            password: hashedFacultyPassword,
            collegeId: college.id,
            departmentId: department.id,
            hodId: hod.id,
        }
    });

    console.log("✅ Faculty Created:", faculty.name);

    // Student
    const student = await prisma.student.create({
        data: {
            name: "test student",
            email: "student@student.com",
            password: hashedStudentPassword,
            collegeId: college.id,
            departmentId: department.id,
            facultyId: faculty.id,
        }
    });

    console.log("✅ Student Created:", student.name);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
