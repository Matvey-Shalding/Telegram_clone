export async function uploadToCloudinary(file: File): Promise<string> {
	// 1. Get signature
	const sigRes = await fetch('/api/cloudinary/sign', {
		method: 'POST'
	})

	if (!sigRes.ok) {
		throw new Error('Failed to get Cloudinary signature')
	}

	const { timestamp, signature, apiKey, cloudName } = await sigRes.json()

	// 2. Prepare form data
	const formData = new FormData()
	formData.append('file', file)
	formData.append('api_key', apiKey)
	formData.append('timestamp', timestamp)
	formData.append('signature', signature)
	formData.append('folder', 'chat-images')

	// 3. Upload to Cloudinary
	const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
		method: 'POST',
		body: formData
	})

	if (!uploadRes.ok) {
		throw new Error('Cloudinary upload failed')
	}

	const data = await uploadRes.json()

	return data.secure_url as string
}
