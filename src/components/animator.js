
let animatables = []

const animate = () => {
  animatables.forEach(animatable => {
    try {
      animatable()
    } catch(error) {
      console.error(error)
    }
  })

  window.requestAnimationFrame(animate)
}

window.requestAnimationFrame(animate)

export const addAnimateable = animatable => {
  animatables.push(animatable)

  return true
}

export const removeAnimateable = animatable => {
  animatables = animatables.filter(a => a === animatable)
}
