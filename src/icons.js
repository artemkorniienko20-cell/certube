// SVG Icons helper for YouTube/Certube interface
export const icons = {
  logo: (width = 90, height = 24) => `
    <div class="certube-logo-wrap" style="display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
      <svg width="${height}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#FF0000"/>
        <path d="M9.5 7.5L16.5 12L9.5 16.5V7.5Z" fill="white"/>
      </svg>
      <span class="certube-brand-text" style="font-weight: 800; font-size: 19px; letter-spacing: -0.8px; color: var(--yt-white);">Cer<span style="color:#ff3333">tube</span></span>
      <span class="certube-country-badge" style="font-size: 10px; color: var(--yt-gray); margin-top: -10px; font-weight: 600;">UA</span>
    </div>
  `,
  home: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 21V10.08l8-6.92 8 6.92V21h-5v-7h-6v7H4z"/>
    </svg>
  `,
  shorts: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.77 10.32l-1.2-.5a5.5 5.5 0 00-.77-.28l1.4-.76a4.57 4.57 0 001.9-4.14 4.7 4.7 0 00-3.3-4.32 4.75 4.75 0 00-5.1 1.7L4.9 11.23a4.72 4.72 0 001.6 6.36l1.2.5.77.29-1.4.75a4.57 4.57 0 00-1.9 4.14 4.7 4.7 0 003.3 4.32c.57.14 1.15.21 1.73.21a4.7 4.7 0 003.37-1.42l5.8-9.2a4.72 4.72 0 00-1.6-6.36zM10 14.65v-5.3l4.8 2.65L10 14.65z"/>
    </svg>
  `,
  plus: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  `,
  subscriptions: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 7H4V5h16v2zm2 4H2V9h20v2zm-2 4H4v-2h16v2zm-2 4H6v-2h12v2z"/>
    </svg>
  `,
  library: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/>
    </svg>
  `,
  search: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  `,
  mic: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
    </svg>
  `,
  bell: () => `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
    </svg>
  `,
  crown: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
    </svg>
  `,
  like: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
    </svg>
  `,
  dislike: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
    </svg>
  `,
  share: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
    </svg>
  `,
  comment: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  `,
  close: () => `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  `,
  check: () => `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3ea6ff">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  `,
  camera: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.4 10.5l4.77-8.26A9.98 9.98 0 002.04 12h9.54c-.95-1.02-1.63-2.22-2.18-3.5zm9.83-6.5a9.97 9.97 0 00-6.19-2.95l2.4 4.15c1.47 1.04 2.7 2.37 3.6 3.88l.19-5.08zM12 22a9.96 9.96 0 008.23-4.32l-4.77-8.26A5.96 5.96 0 0112 18c-.83 0-1.61-.17-2.33-.48l-2.4 4.15c2.09.84 4.36 1.33 6.73 1.33zM12 8a4 4 0 100 8 4 4 0 000-8z"/>
    </svg>
  `,
  upload: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
    </svg>
  `,
  link: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
    </svg>
  `,
  soundOn: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  `,
  soundOff: () => `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  `
};
