import { Button, Card, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BiPlus } from "react-icons/bi";
export default function ProductCard({
  id,  
  name,
  frontImage,
  backImage,
  price,
  inventory,
}) {
  const router = useRouter()
  return (
    <Card
      as={"div"}
      isHoverable
      isPressable
      onClick={() => router.push("/product/" + id)}
      className="group relative border-1 border-foreground-200"
    >
      <Image
        className={
          backImage && `${backImage && "absolute"} z-10 group-hover:invisible`
        }
        src={frontImage}
        width={500}
        height={500}
        alt={name}
      />
      {backImage && (
        <Image
          className="group-hover:visible"
          src={backImage}
          width={500}
          height={500}
          alt={name}
        />
      )}
      <CardFooter className="justify-between">
        <div className="flex flex-col items-start">
          <h4 className="font-bold sm:text-sm md:text-md lg:text-large">
            {name}
          </h4>
          <small className="text-default-500">Rs {price}</small>
        </div>
        <Button isIconOnly variant="flat" color="primary" radius="lg">
          <BiPlus size={30} />
        </Button>
      </CardFooter>
    </Card>
  );
}
