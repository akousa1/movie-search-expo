import { StatusBar } from 'expo-status-bar';
import '../global.css';

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack />
    </>
  );
}
