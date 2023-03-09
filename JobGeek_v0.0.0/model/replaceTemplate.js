module.exports = (temp, data) => {
  let output = temp.replace(/{%TITLE%}/g, data.job_title);
  output = output.replace(/{%IMAGE%}/g, data.imageUrl);
  output = output.replace(/{%DESC%}/g, data.desc);
  output = output.replace(/{%SALARY%}/g, data.salary);

  return output;
};
