const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const isHabitablePlanet = (planet) =>
  planet.koi_disposition === 'CONFIRMED' &&
  planet.koi_insol > 0.36 &&
  planet.koi_insol < 1.11 &&
  planet.koi_prad < 1.6;

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on('error', () => {
        console.log('error');
        reject();
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log('done', countPlanetsFound);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0
    }
  );
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name
      },
      {
        keplerName: planet.kepler_name
      },
      {
        upsert: true
      }
    );
  } catch (e) {
    console.log(`could not save planet ${err}`);
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetsData
};
