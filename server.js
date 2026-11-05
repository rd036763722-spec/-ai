const tr = await timeout(
  ai.models.generateContent({
    model: activeModel,
    contents: [{
      role: 'user',
      parts: [
        {
          text: 'תמלל את ההקלטה בעברית. החזר את המילים שנאמרו בלבד, ללא הסברים.'
        },
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: audioBuffer.toString('base64')
          }
        }
      ]
    }]
  }),
  TIMEOUT
);
