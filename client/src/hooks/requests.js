const URL = 'http://localhost:8000';
// Load planets
async function httpGetPlanets() {
  const response = await fetch(`${URL}/planets`);
  return response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${URL}/launches`);
  const launches = await response.json();
  return launches.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${URL}/launches`, {
      method: 'post',
      body: JSON.stringify(launch),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    return {
      ok: false
    };
  }
}
// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${URL}/launches/${id}`, {
      method: 'delete'
    });
  } catch (e) {
    return {
      ok: false
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
