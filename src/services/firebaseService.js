const API_URL = 'https://firestore.googleapis.com/v1/projects/turbig-a6d5e/databases/(default)/documents';

export function getDataFromFirestore(collection) {
  return fetch(`${API_URL}/${collection}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error fetching data from Firestore:', error);
      throw error;
    });
}

// Post data to Firestore (POST Request)
export function postDataToFirestore(collection, data) {
  return fetch(`${API_URL}/${collection}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

    },
    body: JSON.stringify({
      fields: {
        name: { stringValue: data.name },
        value: { integerValue: data.value },
      },
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to post data to Firestore');
      }
      return response.json();
    })
    .then(data => {
      return data; 
    })
    .catch(error => {
      console.error('Error posting data to Firestore:', error);
      throw error;
    });
}
