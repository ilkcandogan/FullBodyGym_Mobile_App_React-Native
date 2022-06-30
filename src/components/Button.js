import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, useTheme, TextInput} from 'react-native-paper';


const Button = ({ mode, style, customLabelStyle, children, ...props }) => {
  const { colors } = useTheme();
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: colors.surface },
        style,
      ]}
      labelStyle={customLabelStyle ? customLabelStyle : styles.text}
      mode={mode}
      
      {...props}
    >
      {children}
    </PaperButton>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

export default memo(Button);