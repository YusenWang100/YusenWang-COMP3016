#pragma once

#include <cstdint>
#include <string>
#include <vector>

class ModelTexture
{
public:
	enum class EType
	{
		Texture2D,
	};

	ModelTexture();

	void load(const std::string& path, int bpp = 3);

	// loads a cubemap texture from 6 individual texture faces
	// order:
	// +X (right)
	// -X (left)
	// +Y (top)
	// -Y (bottom)
	// +Z (front) 
	// -Z (back)
	// -------------------------------------------------------
	void loadCubemap(const std::vector<std::string>& faces);

	void use() const;

	int32_t getWidth() const { return width; }
	int32_t getHeight() const { return height; }

	float getAspect() const { return static_cast<float>(width) / static_cast<float>(height); }
	
	uint32_t getId() const { return id; }

private:
	uint32_t id = 0;
	std::string name = "";
	EType type = EType::Texture2D;

	int32_t width = 0;
	int32_t height = 0;
	int32_t channels = 0;

	bool isCubemap = false;
};

