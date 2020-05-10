import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PRIMARY } from "../../styles/constants";

const OFFSET = 107;

function Rating({ value }) {
  const [offset, setOffset] = useState(OFFSET);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(OFFSET - (+value / 100) * OFFSET);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <Wrapper>
      <Svg viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke={PRIMARY}
          strokeLinecap="round"
          strokeWidth="3"
          style={{
            strokeDasharray: `${OFFSET}px`,
            strokeDashoffset: `-${offset}px`,
          }}
        />
      </Svg>
      <Value>{value}</Value>
    </Wrapper>
  );
}

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
`;

const Svg = styled.svg`
  width: 2.5rem;
  height: 2.5rem;
  transform: rotate(-90deg);

  circle {
    transition: stroke-dashoffset 750ms ease-out;
  }
`;

const Value = styled.span`
  position: absolute;
  line-height: 2.5rem;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  text-align: center;
  color: ${PRIMARY};
  font-weight: bold;
  font-size: 0.875rem;
`;

export default Rating;
