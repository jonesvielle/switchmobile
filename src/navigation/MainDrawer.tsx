import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/DashboardScreen';
import { DrawerContent } from '../component/DrawerContent';

const Drawer = createDrawerNavigator();

const renderDrawerContent = (props: any) => <DrawerContent {...props} />;

const MainDrawer = () => (
  <Drawer.Navigator
    drawerContent={renderDrawerContent}
    screenOptions={{
      drawerStyle: { backgroundColor: '#ffffff', width: '75%' },
      headerShown: false,
    }}
  >
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
  </Drawer.Navigator>
);

export default MainDrawer;
