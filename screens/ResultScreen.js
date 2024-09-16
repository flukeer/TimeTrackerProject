import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ฟังก์ชันในการแปลงเวลาให้ตรงกับประเทศไทย
const formatThaiTime = (isoString) => {
  const date = new Date(isoString);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Bangkok',
    hour12: false,
  };
  return date.toLocaleString('th-TH', options);
};

const ResultScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordsJSON = await AsyncStorage.getItem('records');
        if (recordsJSON) {
          setRecords(JSON.parse(recordsJSON));
        }
      } catch (error) {
        console.error('Error loading records', error);
      }
    };
    fetchRecords();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{formatThaiTime(item.clockIn)}</Text>
      <Text style={styles.cell}>{item.clockOut ? formatThaiTime(item.clockOut) : '-'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>ชื่อ</Text>
        <Text style={styles.headerCell}>เวลาเข้างาน</Text>
        <Text style={styles.headerCell}>เวลาออกงาน</Text>
      </View>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Pressable
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>กลับไปที่หน้าหลัก</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ResultScreen;
