// svg component for line
export const LineSVG = ({ fill }: { fill: string }) => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 25 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2L22 2"
      stroke={fill}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
