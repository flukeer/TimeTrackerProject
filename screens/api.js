// api.js
import moment from 'moment-timezone';

const API_BASE_URL = 'https://your-api-endpoint.com'; // เปลี่ยนเป็น URL ของ API ที่ใช้งานจริง


// ฟังก์ชันเพื่อรับเวลาในเขตเวลาไทย
const getThailandTime = () => {
  return moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
};

// ฟังก์ชันสำหรับการบันทึกเวลาเข้างาน
export const clockIn = async (employeeId, latitude, longitude) => {
  try {
    
    const response = await fetch(`${API_BASE_URL}/clockin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId,
        clockInTime: getThailandTime(), // ใช้ฟังก์ชันที่เราได้สร้างขึ้น
        latitude,
        longitude,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      return result.success; // สมมุติว่า result มีฟิลด์ success ที่บ่งบอกผลลัพธ์
    } else {
      throw new Error('Response is not in JSON format');
    }

  } catch (error) {
    console.error('Failed to clock in:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับการบันทึกเวลาออกงาน
export const clockOut = async (employeeId, latitude, longitude) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clockout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId,
        clockOutTime: getThailandTime(), // ใช้ฟังก์ชันที่เราได้สร้างขึ้น
        latitude,
        longitude,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      return result.success; // สมมุติว่า result มีฟิลด์ success ที่บ่งบอกผลลัพธ์
    } else {
      throw new Error('Response is not in JSON format');
    }

  } catch (error) {
    console.error('Failed to clock out:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลพนักงาน
export const getEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`);
    
    // ตรวจสอบสถานะของ response
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');

    // ตรวจสอบว่า response เป็น JSON หรือไม่
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data; // สมมุติว่า data เป็น array ของพนักงาน
    } else {
      throw new Error('Response is not in JSON format');
    }

  } catch (error) {
    console.error('Failed to fetch employees:', error);
    throw error;
  }
};
