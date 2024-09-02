from setuptools import find_packages,setup

setup(
    name='AdobeGensolve',
    version='0.0.1',
    author='Team Neuron',
    install_requires=["ultralytics", "opencv-python-headless","numpy"],
    packages=find_packages()
)