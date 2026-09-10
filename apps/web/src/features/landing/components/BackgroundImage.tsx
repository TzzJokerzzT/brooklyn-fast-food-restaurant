import Image from "next/image";

export default function BackgroundImage() {
	return (
		<div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
			<Image
				className="h-full w-full object-cover"
				alt="Brooklyn street food atmosphere"
				src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI0Nh1JzJaDAjklwFMNjhmjNJjf3nEUEBSBRohjt55YbbYdGyCFnkEiHdcdLcYammsMMNlzU7fy3u10xKPU8MQskmCcdq96AFJysr8PvZ24FMsIr5TYWgonuhE_RosbfT7tFefEiNNaxWlUZk3Khk0PgoLq2H6hqsgZ7Rc3R3vpNWbwBTrYa3bcd2cOvd3WZ-ScWB9_AxJz3ogglPm9nkS8rM_NVzTR5tD7epd6Qzdb0w-Z-GvlCuC"
				width={200}
				height={200}
				loading="eager"
			/>
		</div>
	);
}
