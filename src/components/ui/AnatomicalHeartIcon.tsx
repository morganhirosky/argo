export default function AnatomicalHeartIcon({ size = 32, color = '#ff3c3c' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main heart body — asymmetric, apex pointing lower-left */}
      <path
        d="M21 9
           C24 7, 30 7, 32 11
           C35 15, 34 21, 30 27
           C27 31, 23 35, 19 37
           C15 34, 10 29, 8 24
           C5 19, 6 13, 10 10
           C13 7, 18 8, 20 11
           C20 11, 21 9, 21 9Z"
        stroke={color}
        strokeWidth="1.5"
        fill={`${color}18`}
      />
      {/* Aortic arch — curves up and left */}
      <path
        d="M17 9 C16 6, 14 4, 13 3 C12 2, 10 2, 10 4 C10 6, 12 7, 14 8"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Pulmonary trunk — goes straight up */}
      <path
        d="M22 8 C22 6, 22 4, 22 2"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Coronary sulcus — divides atria from ventricles */}
      <path
        d="M10 17 C14 15, 17 14, 20 14 C23 14, 27 15, 31 17"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="2 1.5"
        opacity="0.6"
      />
    </svg>
  )
}
