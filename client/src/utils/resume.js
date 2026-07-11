export const getResumeDisplayName = (resume) => {
  if (!resume) return "New Resume";
  const title = resume.title || "";
  const role = resume.targetRole || "";

  // Check if title is a default placeholder
  const isPlaceholder = 
    !title.trim() || 
    title === "Untitled Resume" || 
    title === "New Resume" || 
    title === "My New Resume" || 
    (title.startsWith("My ") && title.endsWith(" Draft"));

  if (!isPlaceholder) {
    return title;
  }

  if (role.trim()) {
    return `${role} Resume`;
  }

  return "New Resume";
};
