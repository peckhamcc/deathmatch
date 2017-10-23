
let animatables = []

const animate = () => {
  animatables.forEach(animatable => animatable())

  window.requestAnimationFrame(animate)
}

window.requestAnimationFrame(animate)

export const addAnimateable = animatable => {
  animatables.push(animatable)
}

export const removeAnimateable = animatable => {
  animatables = animatables.filter(a => a === animatable)
}
