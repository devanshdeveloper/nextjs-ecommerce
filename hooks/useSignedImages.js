import { getImageFromBucket } from "@/utils/s3-bucket-front";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

function SignedImage({src}) {
  const { data: signedImages , isPending} = useQuery({
    queryKey: ["signedImages"],
    queryFn: () => getImageFromBucket(src),
  });

//   return <Image src={} />;
}

export default useSignedImages;
