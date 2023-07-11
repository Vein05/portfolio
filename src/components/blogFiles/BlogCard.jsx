import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Avatar,
    Tooltip,
		Button,
} from "@material-tailwind/react";

import { ArrowLongRightIcon } from "@heroicons/react/24/outline";



function BlogCard(props){
    return (
        <Card className="overflow-hidden"  style={{ width: '24rem' }}>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 rounded-none"
          >
            <img
              src={props.image}
              alt=""
            />
          </CardHeader>
          <CardBody color="" className="color-main">
            <Typography variant="h4" color="blue-gray">
              {props.title}
            </Typography>
            <Typography variant="lead" color="gray" className="mt-3 font-normal">
							{props.description}
            </Typography>
						<a href="#Blog" className="">
							<Button variant="text" className="pt-3 flex items-center gap-2">
								Learn More 
								<ArrowLongRightIcon strokeWidth={2} className="w-4 h-4" />
							</Button>
        		</a>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center -space-x-3">
              <Tooltip content="Sugam Panthi">
                <Avatar
                  size="sm"
                  variant="circular"
                  alt="sugam panthi"
                  src = "/images/image.jpg"
                  className="border-2 border-white hover:z-10"
                />
              </Tooltip>
            </div>
            <Typography className="font-normal">500 👁 | July 10</Typography>

          </CardFooter>
        </Card>
      );
    }


export default BlogCard