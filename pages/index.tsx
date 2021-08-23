import React from "react";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Image from "next/image";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const IMAGES_OPTIONS = [1, 2, 3, 4];

export const getStaticProps = async () => {
	const breeds = await fetcher("/breeds/list/all");

	return {
		props: {
			breeds: breeds.status === "success" ? Object.keys(breeds.message) : [],
		},
	};
};

export default function Home({ breeds }: { breeds: string[] }) {
	const theme = useTheme();
	const sizeXS = useMediaQuery(theme.breakpoints.down("xs"));
	const sizeSM = useMediaQuery(theme.breakpoints.down("sm"));
	interface ValuesProps {
		breed: string;
		subBreed: string;
		count: string;
	}

	const [values, setValues] = React.useState<ValuesProps>({
		breed: "",
		subBreed: "",
		count: "",
	});

	const [errors, setErrors] = React.useState<
		{ [K in keyof ValuesProps]: boolean }
	>({
		breed: false,
		subBreed: false,
		count: false,
	});

	const [loading, setLoading] = React.useState<boolean>(false);
	const [result, setResult] = React.useState<string[] | []>([]);

	const {
		data: subBreedsData,
		error: noSubBreed,
		mutate: getSubBreeds,
	} = useSWR(values.breed ? `/breed/${values.breed}/list` : null);

	const subBreeds = subBreedsData?.message as string[] | [];

	const handleChange =
		(value: keyof ValuesProps) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			event.preventDefault();
			setErrors({ ...errors, [value]: false });
			setValues({ ...values, [value]: event.target.value });
		};

	const handleSubmit = async (
		event:
			| React.FormEvent<HTMLFormElement>
			| React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		setErrors(() => ({
			breed: !values.breed,
			count: !values.count,
			subBreed: subBreeds?.length > 0 && !values.subBreed,
		}));

		if (
			!values.breed ||
			!values.count ||
			(subBreeds?.length > 0 && !values.subBreed)
		)
			return;
		setLoading(true);
		const res = await fetcher(
			values.breed &&
				values.count &&
				`/breed/${values.breed}${
					values.subBreed ? `/${values.subBreed}` : ""
				}/images/random/${values.count}`
		);
		setResult(res.message as string[]);
		setLoading(false);
	};

	React.useEffect(() => {
		if (values.breed) {
			setValues((values) => ({ ...values, subBreed: "" }));
			getSubBreeds();
		}
	}, [values.breed, subBreeds, getSubBreeds]);

	const capitalize = (string: string) =>
		string[0].toUpperCase() + string.slice(1);

	return (
		<Container>
			<Box my={4}>
				<Typography variant="h4" component="h1" gutterBottom>
					Pictures of dogs by breed
				</Typography>
			</Box>

			<Grid container spacing={2} component="form" onSubmit={handleSubmit}>
				<Grid item xs={12} sm={6} md={3}>
					<TextField
						fullWidth
						select
						id="select-breed"
						label="Select a breed"
						helperText={errors.breed && "Please select a breed"}
						error={errors.breed}
						value={values.breed}
						onChange={handleChange("breed")}
					>
						{breeds.map((option) => (
							<MenuItem value={option} key={`select-breed-${option}`}>
								{capitalize(option)}
							</MenuItem>
						))}
					</TextField>
				</Grid>

				{!noSubBreed && subBreeds?.length > 0 && (
					<Grid item xs={12} sm={6} md={3}>
						<TextField
							fullWidth
							select
							id="select-sub-breed"
							label="Select a sub breed"
							helperText={errors.subBreed && "Please select a sub breed"}
							error={errors.subBreed}
							value={values.subBreed}
							onChange={handleChange("subBreed")}
						>
							{subBreeds.map((option: string) => (
								<MenuItem value={option} key={`select-sub-breed-${option}`}>
									{capitalize(option)}
								</MenuItem>
							))}
						</TextField>
					</Grid>
				)}

				<Grid item xs={12} sm={6} md={3}>
					<TextField
						fullWidth
						select
						id="number-of-images"
						label="Number of images"
						helperText={errors.count && "Please select number of images"}
						error={errors.count}
						value={values.count}
						onChange={handleChange("count")}
					>
						{IMAGES_OPTIONS.map((option: number) => (
							<MenuItem value={option} key={`select-images-${option}`}>
								{option}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Button
						fullWidth
						id="submit-button"
						variant="contained"
						color="primary"
						onClick={handleSubmit}
					>
						Show images
					</Button>
				</Grid>
			</Grid>

			{result.length > 0 && (
				<Box mt={4}>
					{loading ? (
						<CircularProgress />
					) : (
						<ImageList cols={sizeXS ? 1 : sizeSM ? 2 : 4}>
							{result.map((img: string) => (
								<ImageListItem
									style={{ position: "relative", height: "200px" }}
									key={img}
								>
									<Image
										layout="fill"
										objectFit="contain"
										src={img}
										alt={`A picture of ${
											values.subBreed && `${capitalize(values.subBreed)} `
										}${capitalize(values.breed)}`}
									/>
								</ImageListItem>
							))}
						</ImageList>
					)}
				</Box>
			)}
		</Container>
	);
}
