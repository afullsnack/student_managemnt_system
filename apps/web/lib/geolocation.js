// navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

// navigator.geolocation.getCurrentPosition();

export function getCurrentPosition() {
  var coords;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { longitude, latitude } = position.coords;
      // console.log(longitude, latitude);
      coords = { longitude, latitude };
    },
    onPosError,
    {
      enableHighAccuracy: true,
    }
  );
  console.warn(coords, "returned coords");
  return coords;
}

const onPosError = (error) => {
  console.error(error);
  throw error;
};
