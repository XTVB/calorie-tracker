// localStorage.setItem("accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0NzAxMTkzMywiZXhwIjoxOTYyNTg3OTMzfQ.JXtsEFo9G4r5IS2Zwoho2npplt9SN20nV7TZBWDe4Ik");
// localStorage.setItem("accessToken", "");

export const setAccessToken = (s: string) => {
  localStorage.setItem("accessToken", s);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken") || "";
};