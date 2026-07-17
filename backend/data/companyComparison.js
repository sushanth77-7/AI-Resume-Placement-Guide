const { allCompanies } = require('./companies');

function compareCompanies(idA, idB) {
  const companyA = allCompanies.find(c => c.id === idA);
  const companyB = allCompanies.find(c => c.id === idB);

  if (!companyA || !companyB) {
    return null;
  }

  return {
    companyA: {
      id: companyA.id,
      name: companyA.name,
      category: companyA.category,
      difficulty: companyA.preparationRoadmap.difficultyLevel,
      packageRange: companyA.placementInsights.packageRange,
      averagePackage: companyA.placementInsights.averageFresherSalary,
      highestPackage: companyA.placementInsights.highestSalaryRange,
      hiringDemand: companyA.placementInsights.currentHiringDemand,
      eligibilityCGPA: companyA.hiringProcess.eligibility.cgpa,
      eligibilityBranch: companyA.hiringProcess.eligibility.branches,
      roundsCount: companyA.hiringProcess.rounds.length,
      primaryTech: companyA.overview.technologies,
      workLifeBalance: companyA.category === 'Product-Based' ? 'Medium (Task-oriented, flexible hours)' : 'Good (Fixed hours, structured)',
      careerGrowth: companyA.category === 'Product-Based' ? 'Excellent (Fast promotion tracks)' : 'Average-Good (Level-based, steady)',
      learningOpportunities: companyA.category === 'Product-Based' ? 'High (R&D, cutting-edge techs)' : 'High (Structured academies, client systems)'
    },
    companyB: {
      id: companyB.id,
      name: companyB.name,
      category: companyB.category,
      difficulty: companyB.preparationRoadmap.difficultyLevel,
      packageRange: companyB.placementInsights.packageRange,
      averagePackage: companyB.placementInsights.averageFresherSalary,
      highestPackage: companyB.placementInsights.highestSalaryRange,
      hiringDemand: companyB.placementInsights.currentHiringDemand,
      eligibilityCGPA: companyB.hiringProcess.eligibility.cgpa,
      eligibilityBranch: companyB.hiringProcess.eligibility.branches,
      roundsCount: companyB.hiringProcess.rounds.length,
      primaryTech: companyB.overview.technologies,
      workLifeBalance: companyB.category === 'Product-Based' ? 'Medium (Task-oriented, flexible hours)' : 'Good (Fixed hours, structured)',
      careerGrowth: companyB.category === 'Product-Based' ? 'Excellent (Fast promotion tracks)' : 'Average-Good (Level-based, steady)',
      learningOpportunities: companyB.category === 'Product-Based' ? 'High (R&D, cutting-edge techs)' : 'High (Structured academies, client systems)'
    }
  };
}

module.exports = {
  compareCompanies
};
