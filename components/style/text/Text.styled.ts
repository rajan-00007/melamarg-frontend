import styled, { css } from "styled-components";
import { colors } from "@/components/style/colors";
import { textSizes } from "@/components/style/typography";

/* Variants */
export const variants = {
  hero: { tag: "h1", size: textSizes.heading.hero },
  pageTitle: { tag: "h1", size: textSizes.heading.pageTitle },
  sectionTitle: { tag: "h2", size: textSizes.heading.sectionTitle },
  subSectionTitle: { tag: "h3", size: textSizes.heading.subSectionTitle },
  billAmount: { tag: "h1", size: textSizes.heading.billAmount },
  bodyPrimary: { tag: "p", size: textSizes.body.primary },
  bodySecondary: { tag: "p", size: textSizes.body.secondary },
  bodySmall: { tag: "p", size: textSizes.body.small },
  bodyTiny: { tag: "span", size: textSizes.body.tiny },
  summaryHeader: { tag: "h4", size: textSizes.body.summaryHeader },
  button: { tag: "span", size: textSizes.ui.primaryButton },
  label: { tag: "label", size: textSizes.ui.formLabel },
  helper: { tag: "span", size: textSizes.ui.helperText },
  caption: { tag: "span", size: textSizes.ui.caption },
} as const;

/* Base Styles */
interface BaseStyleProps {
  color?: string;
  weight?: number | string;
  align?: string;
  lineHeight?: string;
  $opacity?: number | string;
}

const baseStyle = css<BaseStyleProps>`
  color: ${({ color }) => color ?? colors.base.white};
  font-weight: ${({ weight }) => {
    if (weight === undefined || weight === null) return 400;
    const parsed = typeof weight === "number" ? weight : parseInt(weight as string, 10);
    if (isNaN(parsed)) return weight;
    return Math.min(parsed, 700);
  }};
  text-align: ${({ align }) => align ?? "left"};
  line-height: ${({ lineHeight }) => lineHeight ?? "1.5"};
  ${({ $opacity }) => {
    if ($opacity === undefined || $opacity === null) return "";
    const parsed = typeof $opacity === "number" ? $opacity : parseFloat($opacity);
    if (isNaN(parsed)) return "";
    const opacityVal = parsed > 1 ? parsed / 100 : parsed;
    return css`opacity: ${opacityVal};`;
  }}
`;

/* Styled Component  */
export interface StyledTextProps extends BaseStyleProps {
  size: string | number;
}

export const StyledText = styled.span.withConfig({
  shouldForwardProp: (prop) => !['lineHeight', 'weight', 'align', 'size'].includes(prop as string),
}) <StyledTextProps>`
  ${baseStyle};
  font-size: ${({ size }) => (typeof size === "number" ? `${size}px` : size)};
`;

// Define and export TextProps to be used by the component
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: keyof typeof variants;
  children: React.ReactNode;
  color?: string;
  weight?: number | string;
  align?: "left" | "center" | "right";
  lineHeight?: string;
  opacity?: number | string;
  as?: React.ElementType;
}
