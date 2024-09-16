import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EmployeeSelectionScreen from './screens/EmployeeSelectionScreen';
import ResultScreen from './screens/ResultScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="EmployeeSelection">
      <Stack.Screen name="EmployeeSelection" component={EmployeeSelectionScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
