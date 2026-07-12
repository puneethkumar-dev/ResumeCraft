const ATSAnalysisService = require('../src/services/ai/analysis/ATSAnalysisService');

const service = new ATSAnalysisService();

const jd = `Software Engineer (Fresher)

Location: Remote / Hybrid / On-site
Experience: 0–1 Years
Employment Type: Full-Time

Job Overview

We are looking for enthusiastic and motivated Software Engineers to join our engineering team. As a fresher, you will work alongside experienced developers to design, develop, test, and maintain software applications. You'll receive mentorship while contributing to real-world projects and learning modern software development practices.

Key Responsibilities
Develop, test, and maintain software applications.
Write clean, efficient, and maintainable code.
Debug and troubleshoot software issues.
Participate in code reviews and implement feedback.
Collaborate with cross-functional teams including QA, Product, and Design.
Learn and apply software development best practices, including version control, testing, and documentation.
Participate in Agile ceremonies such as sprint planning, daily stand-ups, and retrospectives.
Continuously improve technical and problem-solving skills.
Required Qualifications
Bachelor's degree in Computer Science, Information Technology, or a related field.
Strong understanding of Data Structures and Algorithms.
Knowledge of at least one programming language such as Java, Python, C++, or JavaScript.
Familiarity with Object-Oriented Programming concepts.
Basic understanding of databases (SQL/NoSQL).
Exposure to Git and version control systems.
Good analytical, communication, and teamwork skills.
Strong willingness to learn new technologies.
Preferred Skills
Knowledge of web technologies (HTML, CSS, JavaScript, React, Angular).
Familiarity with backend frameworks such as Spring Boot, Node.js, or Django.
Understanding of REST APIs.
Basic knowledge of cloud platforms (AWS, Azure, or GCP).
Internship or personal project experience is a plus.`;

console.log('Is valid Job Description:', service.isValidJobDescription(jd));

const trimmed = jd.trim();
console.log('Length:', trimmed.length);

const words = trimmed.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
console.log('Words length:', words.length);
if (words.length > 0) {
  const uniqueWords = new Set(words);
  const ratio = uniqueWords.size / words.length;
  console.log('Unique words:', uniqueWords.size);
  console.log('Ratio:', ratio);
}

const repeatedConsecutive = /(\b\w+\b)( \1){3,}/i.test(trimmed);
console.log('Repeated consecutive words:', repeatedConsecutive);

const professionalRegex = /\b(experience|skills?|qualified|requirements?|responsibilit(ies|y)|developer|engineer|designer|manager|architect|analyst|specialist|lead|officer|bachelor|degree|education|tech(nology|nical)?|programming|coding|software|system|application|database|tools|frameworks?|certificat(ion|e)|degree|university|science|business|marketing|sales|operations?|finance|product|project)\b/i;
console.log('Professional match:', professionalRegex.test(trimmed));
