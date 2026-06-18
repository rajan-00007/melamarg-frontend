import styled, { css } from "styled-components";
import { Button } from "@/components/ui/button";
import { GlobalStyles } from "@/components/style/GlobalStyles";

const { colors, textSizes } = GlobalStyles;

/*Types*/
type ButtonVariant = "primary" | "secondary" | "soft" | "dark";

interface StyledButtonProps {
  width?: string;
  height?: string;
  radius?: string;
  variant?: ButtonVariant;
  bgColor?: string;
  textColor?: string;
  strokeColor?: string;
  $textSize?: number;
}

const variantStyles = {
  primary: css`
    background-color: ${colors.primary[2]}; /* Dark Blue #001540 */
    color: ${colors.base.white};
    border: none;
  `,

  dark: css`
    background-color: ${colors.base.black};
    color: ${colors.base.white};
    border: 1px solid ${colors.base.white};
  `,

  secondary: css`
    background-color: ${colors.base.white};
    color: ${colors.base.black};
    border: 1px solid ${colors.base.black};
  `,

  soft: css`
    background-color: ${colors.base.white};
    border: 2px solid ${colors.blue[200]};
    color: ${colors.reco[500]};
  `,
};

/*Styled Button*/
export const StyledButton = styled(Button)<StyledButtonProps>`
  width: ${({ width }) => width || "auto"};
  height: ${({ height }) => height || "38px"};
  padding: 0 18px;

  border-radius: ${({ radius }) => radius || "8px"};
  border: none;

  font-size: ${({ $textSize }) =>
    $textSize ? `${$textSize}px` : `${textSizes.body.secondary}px`};

  font-weight: 500;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  transition: all 0.2s ease-in-out;
  cursor: pointer;

  /* Apply variant */
  ${({ variant }) => variant && variantStyles[variant]}

  /* Override via custom props */
  ${({ bgColor }) => bgColor && css`background-color: ${bgColor};`}
  ${({ textColor }) => textColor && css`color: ${textColor};`}
  ${({ strokeColor }) =>
    strokeColor && css`border: 1px solid ${strokeColor};`}

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: ${colors.neutral[500]};
    color: ${colors.neutral[700]};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
