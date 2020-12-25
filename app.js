const redis = require("redis");
const amqp = require("amqplib");
const client = redis.createClient();
const data = require("./data.json")
const queueName = process.argv[2] || "jobsQueue";
const message = {};

connect_rabbitmq();


async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    data.forEach(i => {
        message.uid = i.id;
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
        client.set(`user_id${i.id}`, i.id, (error, message) => {
          if (error) {
            console.error(error);
          }
          console.log("Message", message);
        });
    })

  } catch (error) {
    console.log("Error", error);
  }
}




