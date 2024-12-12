export const createMeeting = async ({ token }) => {
  // console.log(token);
  
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};
  
  //itne sa kaam ke liye kya axios use karu
  export const getToken = async () => {
      const res = await fetch(`http://localhost:4000/get-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { token } = await res.json();
      // console.log(token);
      return token;
    };