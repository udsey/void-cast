export function getPositionAtTime(cast) {
  const speed = cast.driftSpeed
  const direction = cast.driftDirection
  const startX = cast.x
  const startY = cast.y
  const startTime = new Date(cast.createdAt).getTime() / 1000

  const currentTimeSeconds = Date.now() / 1000
  const dt = currentTimeSeconds - startTime

  const x = startX + speed * dt * Math.cos(direction)
  const y = startY + speed * dt * Math.sin(direction)

  return { x, y }

  }
