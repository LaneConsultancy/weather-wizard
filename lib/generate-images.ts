import Replicate from "replicate";
import * as fs from "fs";
import * as path from "path";
import https from "https";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

export async function generateImage(
  prompt: string,
  filename: string
): Promise<string> {
  console.log(`Generating image: ${filename}`);
  console.log(`Prompt: ${prompt}`);

  try {
    const output = await replicate.run("google/nano-banana-pro", {
      input: {
        prompt: prompt,
        aspect_ratio: "16:9",
        output_format: "png",
      },
    });

    console.log("Raw output:", typeof output, output);

    let imageUrl: string | null = null;

    if (typeof output === "string") {
      imageUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (output && typeof output === "object" && "url" in output) {
      imageUrl = (output as any).url;
    }

    if (imageUrl) {
      const publicDir = path.join(process.cwd(), "public", "images");
      const filepath = path.join(publicDir, filename);

      await downloadImage(imageUrl, filepath);
      console.log(`✓ Image saved: ${filename}`);

      return `/images/${filename}`;
    }

    throw new Error("No valid image URL in output");
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
    throw error;
  }
}

export async function generateAllImages() {
  const images = [
    {
      prompt: JSON.stringify({
        scene: "Professional UK roofing company hero shot",
        subject: "Skilled roofer on a residential roof in Kent, England",
        style: "Photorealistic, premium quality, blue sky with dramatic clouds",
        lighting: "Golden hour, warm professional lighting",
        mood: "Trustworthy, established, weather-resistant",
        colors: "Navy blue, gold accents, natural roofing tones",
      }),
      filename: "hero.png",
    },
    {
      prompt: JSON.stringify({
        scene: "Roof repair work in progress",
        subject: "Close-up of professional roof tile repair on UK home",
        style: "Photorealistic, detailed craftsmanship",
        lighting: "Natural daylight, clear details",
        mood: "Professional, quality workmanship",
        colors: "Natural clay tile colors, tools, safety equipment",
      }),
      filename: "roof-repairs.png",
    },
    {
      prompt: JSON.stringify({
        scene: "Guttering system maintenance",
        subject: "Clean, well-maintained white guttering on UK residential property",
        style: "Photorealistic, pristine condition",
        lighting: "Bright daylight showing cleanliness",
        mood: "Professional, well-maintained",
        colors: "White guttering, brick house, blue sky",
      }),
      filename: "guttering.png",
    },
    {
      prompt: JSON.stringify({
        scene: "Chimney repair work",
        subject: "Restored brick chimney against dramatic storm clouds",
        style: "Photorealistic, weather-resistant craftsmanship",
        lighting: "Dramatic storm lighting with breaks in clouds",
        mood: "Durable, weather-defying, solid",
        colors: "Red brick, dark storm clouds, weathered charm",
      }),
      filename: "chimney.png",
    },
    {
      prompt: JSON.stringify({
        scene: "Modern flat roof installation",
        subject: "Professional flat roofing work on UK commercial or residential building",
        style: "Photorealistic, modern materials",
        lighting: "Clear daylight showing quality installation",
        mood: "Modern, professional, watertight",
        colors: "Dark grey/black roofing membrane, clean lines",
      }),
      filename: "flat-roofing.png",
    },
    {
      prompt: JSON.stringify({
        scene: "Fascias and soffits installation",
        subject: "Pristine white fascias and soffits on UK home roofline",
        style: "Photorealistic, immaculate finish",
        lighting: "Bright natural light showing clean installation",
        mood: "Fresh, professional, quality finish",
        colors: "Bright white fascias, brick or render walls",
      }),
      filename: "fascias-soffits.png",
    },
  ];

  console.log("Starting image generation process...");
  console.log(`Generating ${images.length} images total\n`);

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    console.log(`[${i + 1}/${images.length}] Processing ${image.filename}...`);
    try {
      await generateImage(image.prompt, image.filename);
      console.log(`✓ Completed ${image.filename}\n`);
    } catch (error) {
      console.error(`✗ Failed to generate ${image.filename}`);
      console.error(error);
      console.log();
    }
  }

  console.log("Image generation process complete!");
}

// Run if called directly
if (require.main === module) {
  generateAllImages()
    .then(() => {
      console.log("All images generated successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error in image generation:", error);
      process.exit(1);
    });
}
