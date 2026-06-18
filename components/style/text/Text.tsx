import React, { forwardRef } from "react";
import { StyledText, variants, TextProps } from "./Text.styled";

// Use -> <Text props... >Hello </Text>

const Text = forwardRef<HTMLElement, TextProps>(({
  variant = "bodyPrimary",
  children,
  color,
  weight,
  align,
  lineHeight,
  opacity,
  as,
  ...props
}, ref) => {
  const { tag, size } = variants[variant];

  const ComponentTag = as || tag;

  return (
    <StyledText
      ref={ref}
      as={ComponentTag}
      size={size}
      color={color}
      weight={weight}
      align={align}
      lineHeight={lineHeight}
      $opacity={opacity}
      {...props}
    >
      {children}
    </StyledText>
  );
});

Text.displayName = "Text";

export default Text;
