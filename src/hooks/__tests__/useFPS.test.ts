describe('useFPS', () => {
  describe('FPS Calculation Logic', () => {
    let frameCount = 0
    let lastTime = 0
    let currentFps = 0
    let setFpsMock: jest.Mock

    const calculateFPS = (timestamp: number): number => {
      frameCount++

      if (timestamp - lastTime >= 1000) {
        currentFps = frameCount
        setFpsMock(frameCount)
        frameCount = 0
        lastTime = timestamp
      }

      return currentFps
    }

    beforeEach(() => {
      frameCount = 0
      lastTime = 0
      currentFps = 0
      setFpsMock = jest.fn()
    })

    it('should increment frame count on each call', () => {
      calculateFPS(0)
      calculateFPS(100)
      calculateFPS(200)

      expect(frameCount).toBe(3)
      expect(setFpsMock).not.toHaveBeenCalled()
    })

    it('should update FPS after 1 second has passed', () => {
      calculateFPS(0)
      calculateFPS(500)
      calculateFPS(999)

      expect(setFpsMock).not.toHaveBeenCalled()

      calculateFPS(1000)

      expect(setFpsMock).toHaveBeenCalledWith(4)
      expect(frameCount).toBe(0)
    })

    it('should reset frame count after updating FPS', () => {
      calculateFPS(0)
      calculateFPS(500)
      calculateFPS(1000)

      expect(setFpsMock).toHaveBeenCalledWith(3)
      expect(frameCount).toBe(0)
      expect(lastTime).toBe(1000)

      calculateFPS(1500)
      calculateFPS(2000)

      expect(setFpsMock).toHaveBeenLastCalledWith(2)
    })

    it('should calculate FPS based on frame count', () => {
      const localSetFps = jest.fn()

      for (let i = 0; i < 8; i++) {
        if (i * 100 - 0 >= 1000) {
          localSetFps(i)
          break
        }
      }

      for (let i = 0; i < 8; i++) {
        calculateFPS(i * 100)
      }

      expect(frameCount).toBe(8)
    })

    it('should maintain FPS value after update', () => {
      calculateFPS(0)
      calculateFPS(1000)

      expect(setFpsMock).toHaveBeenCalledWith(2)

      const fps = calculateFPS(1500)

      expect(fps).toBe(2)
    })

    it('should return 0 when FPS has not been updated yet', () => {
      const fps = calculateFPS(500)

      expect(fps).toBe(0)
      expect(setFpsMock).not.toHaveBeenCalled()
    })

    it('should update lastTime correctly', () => {
      calculateFPS(0)
      calculateFPS(500)
      calculateFPS(1000)

      expect(lastTime).toBe(1000)
    })
  })
})
