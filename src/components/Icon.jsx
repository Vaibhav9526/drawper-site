// Small line icons on a 24 grid.
const paths = {
  pencil: <><path d="M4 20l4-1L18.500 8.500a2.100 2.100 0 0 0-3-3L5 16z" /><path d="M14 7l3 3" /></>,
  brush: <><path d="M19 4.500c-4 1-8.500 5-10 9l2 2c4-1.500 8-6 8-11z" /><path d="M8.500 14C6 14 4.500 16 4.500 18.500 4.500 19.800 3.800 20.500 3 21c3.500.8 7-.3 7.500-3.500" /></>,
  marker: <><path d="M15 4l5 5-8 8H7v-5z" /><path d="M4 20h6" /></>,
  eraser: <><path d="M4.500 15.500l8-8 6 6-5 5H8.500z" /><path d="M9 20h11" /></>,
  cursor: <path d="M5 3.500l13 7.500-5.800 1.600L9.500 18.500z" />,
  table: <><rect x="4" y="5" width="16" height="14" rx="1.500" /><path d="M4 10h16M10 10v9" /></>,
  arrow: <><path d="M4 20 19 5" /><path d="M9 5h10v10" /></>,
  undo: <><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></>,
  trash: <><path d="M5 7h14" /><path d="M9 7V4h6v3" /><path d="M7 7l1 13h8l1-13" /></>,
  play: <path d="M8 5v14l11-7z" fill="currentColor" />,
  pause: <><path d="M8 5v14" strokeWidth="3" /><path d="M16 5v14" strokeWidth="3" /></>,
  copy: <><rect x="8.500" y="8.500" width="12" height="12" rx="1.500" /><path d="M15.500 8.500v-5h-12v12h5" /></>,
  check: <path d="m4 12.500 5 5L20 6.500" />,
  out: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
  star: <path d="M12 3.500l2.600 5.400 5.900.8-4.300 4.100 1 5.800L12 16.800 6.800 19.600l1-5.800L3.500 9.700l5.900-.8z" />,
  fork: <><circle cx="6" cy="5.500" r="2.200" /><circle cx="18" cy="5.500" r="2.200" /><circle cx="12" cy="18.500" r="2.200" /><path d="M6 7.700v1.300c0 1.500 1 2.500 2.500 2.500h7c1.500 0 2.500-1 2.500-2.500V7.700M12 11.500v4.800" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
}

export default function Icon({ name, size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {paths[name]}
    </svg>
  )
}
