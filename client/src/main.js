
export async function fetchData(route = '', data = {}, methodType = 'GET') {
  const upperMethod = methodType.toUpperCase();
  const requestOptions = {
    method: upperMethod,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (upperMethod !== 'GET' && upperMethod !== 'HEAD') {
    requestOptions.body = JSON.stringify(data);
  }

  //sending over our data to specified route in server
  const response = await fetch(`http://localhost:5000${route}`, requestOptions);

  //dealing with our response from server
  if(response.ok) {
    return await response.json();
  } else {
    throw await response.json();
  }
}