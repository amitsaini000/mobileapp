import React from 'react';
import { Text } from 'react-native';
import NavBar, { NavTitle, NavButton } from 'react-native-nav';

export default function NavBarCustom() {
  return (
    <NavBar>
      <NavButton />
      <NavTitle>
        💬 Gifted Chat{'\n'}
        <Text style={{ fontSize: 10, color: '#aaa' }}>version</Text>
      </NavTitle>
      <NavButton />
    </NavBar>
  );
}