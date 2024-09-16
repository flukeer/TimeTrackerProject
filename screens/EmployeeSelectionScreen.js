import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

// ฟังก์ชันในการแปลงเวลาปัจจุบันให้ตรงกับประเทศไทย
const getThaiTime = () => {
  const date = new Date();
  const offset = 7 * 60 * 60 * 1000; // UTC+7
  const thaiTime = new Date(date.getTime() + offset);
  return thaiTime.toISOString();
};

const EmployeeSelectionScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [newEmployee, setNewEmployee] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesJSON = await AsyncStorage.getItem('employees');
        if (employeesJSON) {
          setEmployees(JSON.parse(employeesJSON));
        }
      } catch (error) {
        console.error('Error loading employees', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    if (newEmployee) {
      const updatedEmployees = [...employees, { id: Date.now().toString(), name: newEmployee }];
      try {
        await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
        setEmployees(updatedEmployees);
        setNewEmployee('');
        Alert.alert('พนักงานถูกเพิ่มแล้ว');
      } catch (error) {
        console.error('Error saving employee', error);
      }
    } else {
      Alert.alert('กรุณากรอกชื่อพนักงาน');
    }
  };

  const handleDeleteEmployee = async (id) => {
    Alert.alert(
      'ลบพนักงาน',
      'คุณแน่ใจหรือว่าต้องการลบพนักงานนี้?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ลบ',
          onPress: async () => {
            const updatedEmployees = employees.filter(employee => employee.id !== id);
            try {
              await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
              setEmployees(updatedEmployees);
              Alert.alert('พนักงานถูกลบแล้ว');
            } catch (error) {
              console.error('Error deleting employee', error);
            }
          },
        },
      ]
    );
  };

  const handleClockIn = async () => {
    if (selectedEmployee) {
      const now = getThaiTime();
      const employee = employees.find(emp => emp.id === selectedEmployee);
      const record = {
        id: Date.now().toString(),
        name: employee.name,
        clockIn: now,
        clockOut: null
      };

      try {
        const recordsJSON = await AsyncStorage.getItem('records');
        const records = recordsJSON ? JSON.parse(recordsJSON) : [];
        await AsyncStorage.setItem('records', JSON.stringify([...records, record]));
        Alert.alert('ลงเวลาเข้างานสำเร็จ');
      } catch (error) {
        console.error('Error saving clock-in record', error);
      }
    } else {
      Alert.alert('กรุณาเลือกชื่อพนักงาน');
    }
  };

  const handleClockOut = async () => {
    if (selectedEmployee) {
      const now = getThaiTime();
      const recordsJSON = await AsyncStorage.getItem('records');
      const records = recordsJSON ? JSON.parse(recordsJSON) : [];
      const updatedRecords = records.map(record => 
        record.name === employees.find(emp => emp.id === selectedEmployee)?.name && !record.clockOut
          ? { ...record, clockOut: now }
          : record
      );

      try {
        await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));
        Alert.alert('ลงเวลาออกงานสำเร็จ');
      } catch (error) {
        console.error('Error saving clock-out record', error);
      }
    } else {
      Alert.alert('กรุณาเลือกชื่อพนักงาน');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>เลือกชื่อพนักงาน</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedEmployee}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
        >
          <Picker.Item label="เลือกชื่อพนักงาน" value="" />
          {employees.map((employee) => (
            <Picker.Item key={employee.id} label={employee.name} value={employee.id} />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="กรอกชื่อพนักงานใหม่"
        value={newEmployee}
        onChangeText={setNewEmployee}
      />
      <Button title="เพิ่มพนักงาน" onPress={handleAddEmployee} color="#4CAF50" />
      <View style={styles.buttonContainer}>
        <Button title="ลงเวลาเข้างาน" onPress={handleClockIn} color="#4CAF50" />
        <Button title="ลงเวลาออกงาน" onPress={handleClockOut} color="#F44336" />
      </View>
      <Button
        title="ดูผลลัพธ์"
        onPress={() => navigation.navigate('Result')}
        color="#2196F3"
      />
      <Text style={styles.subtitle}>รายชื่อพนักงาน</Text>
      <View style={styles.listContainer}>
        {employees.map(employee => (
          <View key={employee.id} style={styles.employeeRow}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteEmployee(employee.id)}
            >
              <Text style={styles.deleteButtonText}>ลบ</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  listContainer: {
    width: '100%',
    maxWidth: 300,
  },
  employeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  employeeName: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default EmployeeSelectionScreen;
