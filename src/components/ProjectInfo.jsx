import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
  } from "@material-tailwind/react";
import Image from "../images/image.jpg"   
  export default function Example() {
    return (
      <Card color="transparent" shadow={false} className="w-full max-w-[26rem]">
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="mx-0 flex items-center gap-4 pt-0 pb-8"
        >
          <Avatar
            size="lg"
            src={Image}
            alt="Sugam Patnhi"
          />
          <div className="flex w-full flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <Typography variant="h5" color="blue-gray">
                Sugam Panthi
              </Typography>
            </div>
            <Typography color="blue-gray">Self-Taught Developer [Python, WebDev]</Typography>
          </div>
        </CardHeader>
        <CardBody className="mb-6 p-0">
          <Typography>
            &quot;Throughout my personal odyssey in the realm of computer programming and software engineering, I have reached some significant pinnacles. These include but are not limited to: the production of a highly-regarded Discord bot that has amassed over a million users, the creation of a user interface for a scientific calculator that is both intuitive and user-friendly, the development of a comprehensive music player for Linux operating systems, participation in a prestigious Discord bot project, and the construction of a robust web application using React, Python, and Firebase. These accomplishments are a testament to my ardor for programming and software development, and my unwavering devotion to delivering practical solutions that are imbued with an amiable and congenial touch.&quot;
          </Typography>
        </CardBody>
      </Card>
    );
  }