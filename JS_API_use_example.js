class AudioProcessingAPI {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
    }

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    async processAudioFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.baseURL}/process-audio`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Audio processing failed:', error);
            throw error;
        }
    }

    async generateAndProcess(text = null) {
        try {
            const url = new URL(`${this.baseURL}/generate-and-process`);
            if (text) {
                url.searchParams.append('text', text);
            }

            const response = await fetch(url, {
                method: 'POST',
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Generate and process failed:', error);
            throw error;
        }
    }
}