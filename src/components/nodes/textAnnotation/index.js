import component from './textAnnotation.vue';
import { configId } from '@/components/inspectors/configId';
export const id = 'processmaker-modeler-text-annotation';

export default {
  id,
  component,
  bpmnType: 'bpmn:TextAnnotation',
  control: true,
  category: 'BPMN',
  icon: require('@/assets/toolpanel/text-annotation.svg'),
  label: 'Text Annotation',
  definition(moddle, $t) {
    return moddle.create('bpmn:TextAnnotation', {
      text: $t('New Text Annotation'),
    });
  },
  diagram(moddle) {
    return moddle.create('bpmndi:BPMNShape', {
      bounds: moddle.create('dc:Bounds', {
        height: 30,
        width: 150,
      }),
    });
  },
  /**
   * Validate whether to accept an incoming flow from the node
   *
   * @param node
   */
  validateIncoming() {
    return false;
  },
  /**
   * Validate whether to accept an incoming association from an artifact
   *
   * @param node
   */
  validateAssociationIncoming() {
    return false;
  },
  inspectorConfig: [
    {
      name: 'Text Annotation',
      items: [
        {
          component: 'FormAccordion',
          container: true,
          config: {
            initiallyOpen: true,
            label: 'Configuration',
            icon: 'cog',
            name: 'confifuration',
          },
          items: [
            {
              component: 'FormInput',
              config: {
                label: 'Identifier',
                helper: configId.helper,
                name: configId.id,
                validation: configId.validation,
              },
            },
            {
              component: 'FormInput',
              config: {
                label: 'Annotation Description',
                helper: 'Body of the text annotation',
                name: 'text',
                placeholder: 'New Text Annotation',
              },
            },
          ],
        },
      ],
    },
  ],
};
