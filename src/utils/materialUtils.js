export const getSustainabilityColor = (score) => {
    const numScore = parseFloat(score) || 0;
    if (numScore >= 5) return '#10b981'; // Green for high sustainability (5-6)
    if (numScore >= 3) return '#f59e0b'; // Yellow for medium sustainability (3-4)
    return '#ef4444'; // Red for low sustainability (1-2)
};
