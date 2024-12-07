// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

export const makeRandomCoordinates = (logStepsHor, logStepsVer, logWidth)  => {
	const indices = [];
	const weights = [];
	
	for (let j = 0; j < 2**logStepsVer; j++) {
		for (let i = 0; i < 2**logStepsHor; i++) {
			indices.push(i + 2**logStepsHor*j);
			
			const w = gaussianRandom(i / 2**logStepsHor * logStepsHor, 0.4);
			weights.push(w);
		}
	}
	// console.log(indices);
	indices.sort((a, b) => weights[b] - weights[a]);
	
	const coordinates = [];
	
	for (let i = 0; i < 2**(logStepsHor + logStepsVer); i++) {
		const idx = indices[i];
		coordinates.push([(idx % 2**logStepsHor) * 2**logWidth, Math.floor(idx / 2**logStepsHor) * 2**logWidth]);
	}
	
	// console.log(coordinates);
	return coordinates;
}