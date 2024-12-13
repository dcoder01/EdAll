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
//karna hi pada->i needed the token